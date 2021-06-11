import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { ProjectRepository } from '../../repository/ProjectRepository'
import { TaskRepository } from '../../repository/TaskRepository'

export class ProjectController {
  async index(req, res) {
    return res.send( req.userId )
  }
  async list(req, res:Response) {
    try {
      const projectRepository = getCustomRepository(ProjectRepository)

      const allProjects = await projectRepository.find()

      return res.send({ allProjects })
    } catch (err) {
      res.status(400).send({ error: err.message })
    }
  }
  async show(req, res:Response) {
    try {
      const projectRepository = getCustomRepository(ProjectRepository)
 
      const { id } = req.params

      const project = await projectRepository.findOne({ where: { id } })

      return res.send({ project })
    } catch (err) {
      res.status(400).send({ error: err.message })
    }
  }
  async create(req, res:Response) {
    try { 
      const projectRepository = getCustomRepository(ProjectRepository)
      const taskRepository = getCustomRepository(TaskRepository)

      const { title, description, tasks } = req.body
 
      const project = projectRepository.create({
        title,
        description,
        user: req.userId
      })

      await projectRepository.save(project)

      tasks.map(async task => {
        const projectTask = taskRepository.create({
          ...task,
          project: project.id,
          assignedTo: req.userId
        })

        await taskRepository.save(projectTask)
      })

      return res.send({ ok: true, user: req.userId, project })
    } catch (err) {
      res.status(400).send({ error: 'Error creating new project' })
    }
  }
  async update(req:Request, res:Response) {
    try {
      const { userId } = req.body

      return res.send(userId)
    } catch (err) {
      return res.send('Catch')
    }
    
    /*
    try {
      

      

      let projectToUpdate = await projectRepository.findOne(id);

      projectToUpdate.title = title
      projectToUpdate.description = description

      await projectRepository.save(projectToUpdate);

      return res.send({ ok: true })
    } catch (err) {
      res.status(400).send({ error: 'Error delete project' })
    }
    */
  }
  async delete(req, res:Response) {
    try {
      const projectRepository = getCustomRepository(ProjectRepository)

      const { id } = req.params

      const projectToRemove = await projectRepository.findOne({ where: { id } });

      await projectRepository.remove(projectToRemove);

      return res.send({ ok: true })
    } catch (err) {
      res.status(400).send({ error: 'Error deleting project' })
    }
  }
}
