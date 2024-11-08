import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { IsDate } from 'class-validator';
import { ChatEntity } from './Chat.entity';
import { UserEntity } from './User.entity';

@Entity({ name: 'Messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10000, nullable: false })
  content: string;

  @Column({ type: 'bool', default: false })
  is_read: boolean;

  @ManyToOne(() => ChatEntity, chat => chat.messages)
  chat: ChatEntity;

  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @CreateDateColumn()
  @IsDate()
  updated_at: Date;
}
