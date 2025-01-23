import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from './Message.entity';
import { IsDate } from 'class-validator';

@Entity({ name: 'MessageUploads' })
export default class MessageUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  contentType: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  url: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  fileName: string;

  @Column({ type: 'bigint', nullable: false })
  size: number;

  @CreateDateColumn({ name: 'created_at' })
  @IsDate()
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => MessageEntity, msg => msg.uploads)
  message: MessageEntity;
}
