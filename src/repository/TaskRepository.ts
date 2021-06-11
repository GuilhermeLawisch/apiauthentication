import { EntityRepository, Repository } from "typeorm";
import { Task } from "../app/entity/Task";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}