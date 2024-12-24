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

  @Column({ type: 'bool', default: false, name: 'is_read' })
  isRead: boolean;

  @ManyToOne(() => ChatEntity, chat => chat.messages)
  chat: ChatEntity;

  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  @IsDate()
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  @IsDate()
  updatedAt: Date;
}
