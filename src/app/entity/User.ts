import {Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { v4 as uuid } from 'uuid'
import { Project } from "./Project";
import { Task } from "./Task";

@Entity("users")
export class UserSchema {
    @PrimaryColumn()
    id: string;

    @Column()
    user: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        nullable: true
    })
    password_reset_token: string;

    @Column({
        nullable: true
    })
    password_reset_expires: Date;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Project, project => project.user)
    project: Project[];

    @OneToMany(() => Task, task => task.assignedTo)
    task: Task[];

    constructor() {  
        if (!this.id) {
            this.id = uuid()
        }
    }
}
