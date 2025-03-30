import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class SurveyResponse {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User)
    user!: User;

    @Column("jsonb")
    demographic!: {
        name: string;
        age: number;
        gender: string;
        location: string;
    };

    @Column("jsonb")
    health!: {
        currentConditions: string[];
        medications: string[];
        lifestyle: {
            exercise: string;
            diet: string;
            smoking: boolean;
        };
    };

    @Column("jsonb")
    financial!: {
        income: number;
        savings: number;
        insurance: boolean;
    };

    @CreateDateColumn()
    createdAt!: Date;
} 