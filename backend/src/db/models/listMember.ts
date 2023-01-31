import { BelongsToGetAssociationMixin, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { List } from "./list";
import { User } from './user';

export class ListMember extends Model<InferAttributes<ListMember>, InferCreationAttributes<ListMember>> {
    declare public id: CreationOptional<number>;
    declare public userId: ForeignKey<User["id"]>;
    declare public listId: ForeignKey<List["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare list?: NonAttribute<List>;
    declare user?: NonAttribute<User>;

    declare getList: BelongsToGetAssociationMixin<List>;
    declare getUser: BelongsToGetAssociationMixin<User>;
}

export function initListMemberModel(sequelize: Sequelize): void {
    ListMember.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        listId: {
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
        tableName: "listmembers",
    });
}