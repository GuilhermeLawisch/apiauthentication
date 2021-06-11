import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Task } from "./Task";
import { UserSchema } from './User'

@Entity('project')
export class Project {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => UserSchema, user => user.project)
  user: UserSchema;

  @OneToMany(() => Task, task => task.project)
  task: Task[];

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