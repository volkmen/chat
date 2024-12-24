import { Entity, PrimaryGeneratedColumn, ManyToMany, Column, CreateDateColumn, OneToMany, JoinTable } from 'typeorm';
import { IsDate } from 'class-validator';
import { MessageEntity } from './Message.entity';
import { UserEntity } from './User.entity';

@Entity({ name: 'Chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false, name: 'is_group' })
  isGroup: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @IsDate()
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  @IsDate()
  updatedAt: Date;

  @OneToMany(() => MessageEntity, message => message.chat, { onDelete: 'CASCADE' })
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'UsersChats'
  })
  users: UserEntity[];
}
