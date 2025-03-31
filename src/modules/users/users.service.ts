import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>) { }

  async create(createUserDto: CreateUserDto) {
    // check email exist
    const isExist = await this.UserModel.findOne({ email: createUserDto.email });
    if (isExist) throw new BadRequestException('Email existed');

    // hash password
    const cipher = hashPasswordHelper(createUserDto.password);

    const newUser = await this.UserModel.create({ ...createUserDto, password: cipher });
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt
    }
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    current = current ? current : 1;
    const defaultLimit = pageSize ? pageSize : 10;
    const offset = (current - 1) * defaultLimit;

    const { filter, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.UserModel.find(filter)
      .limit(defaultLimit)
      .skip(offset)
      .sort(sort as any)
      .select('-password')
      .exec();

    return {
      result,
      totalPages
    };
  }

  async findOne(_id: string) {
    return await this.UserModel.findOne({ _id });;
  }

  async findOneByEmail(email: string) {
    return await this.UserModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.UserModel.updateOne(
      { _id: updateUserDto._id }, updateUserDto
    );
  }

  async remove(id: string) {
    // check valid id
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException('Invalid ID');
    return await this.UserModel.delete({ _id: id });
  }
}
