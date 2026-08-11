import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const query = session.role === "client" ? { client: session.userId } : {};
  const projects = await Project.find(query)
    .populate("service", "name")
    .populate("client", "fullName email")
    .sort({ createdAt: -1 })
    .lean<{ _id: unknown; [key: string]: unknown }[]>();

  const projectsWithTasks = await Promise.all(
    projects.map(async (p) => {
      const tasks = await Task.find({ project: p._id }).sort({ order: 1 }).lean();
      return { ...p, tasks };
    })
  );

  return NextResponse.json({ projects: projectsWithTasks });
}

const createSchema = z.object({
  name: z.string().min(2),
  client: z.string(),
  service: z.string(),
  startDate: z.string(),
  deadline: z.string().optional(),
  tasks: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role === "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const { tasks, ...projectData } = parsed.data;

  const project = await Project.create(projectData);
  if (tasks.length) {
    await Task.insertMany(tasks.map((title, order) => ({ project: project._id, title, order })));
  }

  return NextResponse.json({ project }, { status: 201 });
}

const progressSchema = z.object({
  projectId: z.string(),
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(["Not Started", "In Progress", "On Hold", "Completed"]).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role === "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = progressSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const { projectId, ...update } = parsed.data;
  const project = await Project.findByIdAndUpdate(projectId, update, { new: true });
  return NextResponse.json({ project });
}
