import { sign } from 'jsonwebtoken';
const authconfig = require('../../config/auth')

export function generateToken(id: string) {
  const token = sign({ id }, authconfig.secret, {
    expiresIn: 86400
  })

  return token;
}