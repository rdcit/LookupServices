/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.rdcit.oc.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import org.rdcit.controller.AppConfig;

/**
 *
 * @author sa841
 */
public class Connect {

    Connection connection;
    private AppConfig appConfig;

    public Connection openConnection() {
        appConfig = AppConfig.getAppConfig();
        try {
            Class.forName("org.postgresql.Driver");
            connection = DriverManager.getConnection("jdbc:postgresql://" + appConfig.getHostAddress() + ":" + appConfig.getHostPort() + "/"
                    + appConfig.getDbName(), appConfig.getDbUserName(), appConfig.getDbUserPwd());
            if (connection != null) {
                System.out.println("You made it, take control your database now!");
            } else {
                System.out.println("Failed to make connection!");
            }
        } catch (ClassNotFoundException | SQLException ex) {
            System.out.println(ex.getMessage());
        }
        return connection;
    }

    public void closeConnection() {
        try {
            connection.close();
            System.out.println("Connection closed !");
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }
    }

}
