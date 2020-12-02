import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class ExampleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}