import {
    MigrationInterface,
    QueryRunner,
    Table, TableForeignKey,
} from 'typeorm';

export class schema1591792135745 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name: 'manufacturers',
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "phone",
                    type: "varchar",
                },
                {
                    name: "siret",
                    type: "int",
                }
            ]
        }), true)

        await queryRunner.createTable(new Table({
            name: 'owners',
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "purchaseDate",
                    type: "timestamp",
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true)

        await queryRunner.createTable(new Table({
            name: 'cars',
            foreignKeys: [
              new TableForeignKey({
                  referencedTableName: 'manufacturers',
                  referencedColumnNames: ['id'],
                  columnNames: ['manufacturer'],
              }),
            ],
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "manufacturer",
                    type: "uuid",
                    isNullable: true,
                },
                {
                    name: "price",
                    type: "int",
                },
                {
                    name: "firstRegistrationDate",
                    type: "timestamp",
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: 'car_owners',
            foreignKeys: [
                new TableForeignKey({
                    referencedTableName: 'cars',
                    referencedColumnNames: ['id'],
                    columnNames: ['car_id'],
                }),
                new TableForeignKey({
                    referencedTableName: 'owners',
                    referencedColumnNames: ['id'],
                    columnNames: ['owner_id'],
                }),
            ],
            columns: [
                {
                    name: "car_id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "owner_id",
                    type: "uuid",
                    isPrimary: true,
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        /* do nothing */
    }

}

