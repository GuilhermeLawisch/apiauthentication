import { EntityRepository, Repository } from "typeorm";
import { UserSchema } from "../app/entity/User";

@EntityRepository(UserSchema)
class UserRepository extends Repository<UserSchema> {}

export { UserRepository };
