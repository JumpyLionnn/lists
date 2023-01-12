import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { User } from "./user";

export class List extends Model<InferAttributes<List>, InferCreationAttributes<List>> {
    declare public id: CreationOptional<number>;
    declare public name: string;
    declare public creatorId: ForeignKey<User["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare creator?: NonAttribute<User>;

    declare getCreator: BelongsToGetAssociationMixin<User>;
    declare setCreator: BelongsToSetAssociationMixin<User, User["id"]>;
    declare createCreator: BelongsToCreateAssociationMixin<User>;
}

export function initListModel(sequelize: Sequelize): void {
    List.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        creatorId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        deletedAt: false,
        indexes: [],
        sequelize: sequelize,
        tableName: "lists",
    });
}