import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { IsDate } from 'class-validator';
import { UserEntity } from './User.entity';
import { MessageEntity } from './Message.entity';
import { PublicKeyEntity } from './PublicKey.entity';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'boolean', default: false })
  is_group: boolean;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @CreateDateColumn()
  @IsDate()
  updated_at: Date;

  @OneToMany(() => MessageEntity, message => message.chat, { onDelete: 'CASCADE' })
  messages: MessageEntity[];

  @OneToMany(() => PublicKeyEntity, pbKey => pbKey.chat, { onDelete: 'CASCADE' })
  pbKeys: PublicKeyEntity[];
}
