import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare public email: string;
    declare public id: CreationOptional<number>;
    declare public password: string;
    declare public username: string;
}

export function initUserModel(sequelize: Sequelize): void {
    User.init({
        email: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING(60)
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING(50)
        }
    },
    {
        deletedAt: false,
        indexes: [
            {
                unique: true, 
                fields: ['email']
            },
            {
                unique: true, 
                fields: ["id"]
            }
        ],
        sequelize: sequelize,
        tableName: "users",
    });
}