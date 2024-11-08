import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { ChatEntity } from './Chat.entity';
import { UserEntity } from './User.entity';

@Entity()
export class PublicKeyEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 2048 })
  publicKey: string;

  @ManyToOne(() => ChatEntity, chat => chat.pbKeys)
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, user => user.pbKeys)
  user: UserEntity;
}
