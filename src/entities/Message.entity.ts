import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { IsDate } from 'class-validator';
import { ChatEntity } from './Chat.entity';
import { UserEntity } from './User.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'Messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10000, nullable: false })
  content: string;

  @Column({ type: 'bool', default: false })
  @Expose({ name: 'isRead' })
  is_read: boolean;

  @ManyToOne(() => ChatEntity, chat => chat.messages)
  chat: ChatEntity;

  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @CreateDateColumn()
  @IsDate()
  @Expose({ name: 'createdAt' }) // Transform field name
  created_at: Date;

  @CreateDateColumn()
  @IsDate()
  @Expose({ name: 'updatedAt' })
  updated_at: Date;
}
