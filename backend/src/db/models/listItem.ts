import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { List } from "./list";

export class ListItem extends Model<InferAttributes<ListItem>, InferCreationAttributes<ListItem>> {
    declare public id: CreationOptional<number>;
    declare public content: string;
    declare public listId: ForeignKey<List["id"]>;
    declare public checked: CreationOptional<boolean>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare list?: NonAttribute<List>;

    declare getList: BelongsToGetAssociationMixin<List>;
    declare setList: BelongsToSetAssociationMixin<List, List["id"]>;
    declare createList: BelongsToCreateAssociationMixin<List>;
}

export function initListItemModel(sequelize: Sequelize): void {
    ListItem.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        content: {
            allowNull: false,
            type: DataTypes.STRING(300)
        },
        listId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        checked: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        deletedAt: false,
        indexes: [],
        sequelize: sequelize,
        tableName: "listitems",
    });
}