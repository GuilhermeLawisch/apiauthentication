import { Column, CreateDateColumn, Entity, PrimaryColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid"
import { Project } from "./Project";
import { UserSchema } from "./User";

@Entity('task')
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Project, project => project.task)
  project: Project;

  @ManyToOne(() => UserSchema, assignedTo => assignedTo.task)
  assignedTo: UserSchema;

  @Column()
  completed: boolean

  @UpdateDateColumn()
  update_at: Date;

  @CreateDateColumn()
  create_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}