import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class ExampleEntity {
    constructor() {
        this.id = 0;
        this.name = "";
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}