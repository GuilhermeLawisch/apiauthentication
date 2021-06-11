import { EntityRepository, Repository } from "typeorm";
import { Project } from "../app/entity/Project";


@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {} 