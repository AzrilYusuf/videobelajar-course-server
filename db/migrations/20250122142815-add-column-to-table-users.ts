'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'picture', {
            type: Sequelize.STRING(255),
            allowNull: true,
        });

        await queryInterface.addColumn('users', 'role', {
            type: Sequelize.ENUM,
            values: ['Admin', 'User'],
            allowNull: false,
            defaultValue: 'User',
        });

        await queryInterface.addColumn('users', 'is_verified', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        await queryInterface.addColumn('users', 'verification_token', {
            type: Sequelize.STRING(255),
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'picture');
        await queryInterface.removeColumn('users', 'role');
        await queryInterface.removeColumn('users', 'is_verified');
        await queryInterface.removeColumn('users', 'verification_token');
    },
};
