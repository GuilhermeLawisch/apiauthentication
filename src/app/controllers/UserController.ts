import { Request, Response } from 'express'
import { getCustomRepository, getConnection } from "typeorm";
import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";

import { UserRepository } from '../../repository/UserRepository';
import { generateToken } from '../services/token';
import { UserSchema } from '../entity/User';
const mailer = require('../../modules/mailer')

export class UserController {
  async register(req:Request, res:Response) {
    const { user, email, password } = req.body

    try {
      const userRepository = getCustomRepository(UserRepository)

      if (user === '' || email === '' || password === '') {
        return res.status(400).send({ error: `Registration failed` })
      }

      const userAlreadyExists = await userRepository.find({ where: { email } })

      if (userAlreadyExists.length > 0) {
        return res.status(400).send({ error: 'User Already Exists' })
      }

      const passwordHash = await hash(password, 10)
    
      const userCreating = userRepository.create({
        user, 
        email,
        password: passwordHash
      });

      await userRepository.save(userCreating);

      userCreating.password = undefined

      return res.status(201).send( userCreating )

    } catch (err) {
      res.status(400).send({ error: `Erro desconhecido: ${err}` })
    }

  }
  async authenticate(req:Request, res:Response) {
    const { email, password } = req.body

    const userRepository = getCustomRepository(UserRepository)

    const user = await userRepository.findOne({ where: { email } })

    if (!user) {
      return res.status(400). send({ error: "User not found" })
    }

    if (!await compare(password, user.password)) {
      return res.status(400).send({ error: "Invalid password" })
    }

    user.password = undefined;

    const token = generateToken(user.id)

    res.send({ user, token })
  }
  async forgot_password(req:Request, res:Response) {
    const { email } = req.body

    try {
      const userRepository = getCustomRepository(UserRepository)

      const user = await userRepository.findOne({ where: { email } })

      if (!user) {
        return res.status(400).send({ error: 'User not found' })
      }

      const token = randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await getConnection()
          .createQueryBuilder()
          .update(UserSchema)
          .set({
            password_reset_token: token,
            password_reset_expires: now 
          })
          .where("email = :email", { email })
          .execute();

      mailer.sendMail({
        to: email,
        from: 'dreamerfortest@gmail.com',
        template: 'auth/forgot_password',
        context: { token }
      }, (err) => {
        if (err) {
          console.log(err)
          res.status(400).send({ error: 'Cannot send forgot password email' })
        }
        return res.send()
      })

    } catch (err) {
      res.status(400).send({ error: "Error on forgot password, try again" })
    }
  }
  async reset_password(req:Request, res:Response) {
    const { email, token, password } = req.body

    try {
      const userRepository = getCustomRepository(UserRepository)

      const user = await userRepository.findOne({ where: { email } })

      if (!user) {
        return res.status(400).send({ error: 'User not found' })
      }

      if (token !== (await user).password_reset_token) {
        return res.status(400).send({ error: 'Token invalid' })
      }

      const now = new Date()
      if (now > (await user).password_reset_expires) {
        return res.status(400).send({ error: 'Token expired, generate a new one' })
      }

      const passwordHash = await hash(password, 10)

      const userUpdate = userRepository.create({
        ...user,
        password: passwordHash
      });

      await userRepository.save(userUpdate);

    } catch (err) {
      res.status(400).send({ error: "Error on forgot password, try again" })
    }
  }
} 