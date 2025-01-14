'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fullname: {
                allowNull: false,
                type: Sequelize.STRING(150),
            },
            email: {
                allowNull: false,
                unique: 'email_unique',
                type: Sequelize.STRING(100),
            },
            phone_number: {
                allowNull: false,
                unique: 'phone_unique',
                type: Sequelize.STRING(15),
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING(255),
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    },
};
