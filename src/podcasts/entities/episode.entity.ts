import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode {
  @Field((_) => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => String)
  @Column()
  title: string;

  @Field((_) => String)
  @Column()
  category: string;
}
