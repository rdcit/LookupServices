/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.rdcit.oc.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertNotNull;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import org.rdcit.controller.AppConfig;

/**
 *
 * @author sa841
 */
public class ConnectTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void mockOpenConnection_Case_IDEAL() throws ClassNotFoundException, SQLException {
        AppConfig appConfig = mock(AppConfig.class);
        doReturn("openclinica-testing.medschl.cam.ac.uk").when(appConfig).getHostAddress();
        doReturn("5432").when(appConfig).getHostPort();
        doReturn("ocplay").when(appConfig).getDbName();
        doReturn("postgres").when(appConfig).getDbUserName();
        doReturn("oc33ca").when(appConfig).getDbUserPwd();
        Class.forName("org.postgresql.Driver");
        Connection connection = DriverManager.getConnection("jdbc:postgresql://" + appConfig.getHostAddress() + ":" + appConfig.getHostPort() + "/"
                + appConfig.getDbName(), appConfig.getDbUserName(), appConfig.getDbUserPwd());
        assertNotNull(connection);
        connection.close();
    }

    @Test
    public void mockOpenConnection_Case_False_DB_Credentials() throws ClassNotFoundException, SQLException {
        AppConfig appConfig = mock(AppConfig.class);
        doReturn("openclinica-testing.medschl.cam.ac.uk").when(appConfig).getHostAddress();
        doReturn("5432").when(appConfig).getHostPort();
        doReturn("oclive").when(appConfig).getDbName();
        doReturn("postgres").when(appConfig).getDbUserName();
        doReturn("oc33ca").when(appConfig).getDbUserPwd();
        Class.forName("org.postgresql.Driver");
        thrown.expect(SQLException.class);
        thrown.expectMessage(equalTo("FATAL: database \"oclive\" does not exist"));
        Connection connection = DriverManager.getConnection("jdbc:postgresql://" + appConfig.getHostAddress() + ":" + appConfig.getHostPort() + "/"
                + appConfig.getDbName(), appConfig.getDbUserName(), appConfig.getDbUserPwd());
    }

    @Test
    public void mockOpenConnection_Case_Wrong_Formatted_Config_File() throws ClassNotFoundException, SQLException {
        AppConfig appConfig = mock(AppConfig.class);
        doReturn("openclinica-testing.medschl.cam.ac.uk").when(appConfig).getHostAddress();
        doReturn("5432").when(appConfig).getHostPort();
        doReturn("oclive").when(appConfig).getDbName();
        doReturn("postgres").when(appConfig).getDbUserName();
        doReturn(null).when(appConfig).getDbUserPwd();
        Class.forName("org.postgresql.Driver");
        thrown.expect(SQLException.class);
        thrown.expectMessage(equalTo("The server requested password-based authentication, but no password was provided."));
        Connection connection = DriverManager.getConnection("jdbc:postgresql://" + appConfig.getHostAddress() + ":" + appConfig.getHostPort() + "/"
                + appConfig.getDbName(), appConfig.getDbUserName(), appConfig.getDbUserPwd());
    }

    @Test(expected = org.postgresql.util.PSQLException.class)
    public void mockOpenConnection_Case_Missing_JAR() throws SQLException {
        AppConfig appConfig = mock(AppConfig.class);
        doReturn("openclinica-testing.medschl.cam.ac.uk").when(appConfig).getHostAddress();
        doReturn("5432").when(appConfig).getHostPort();
        doReturn("oclive").when(appConfig).getDbName();
        doReturn("postgres").when(appConfig).getDbUserName();
        doReturn("oc33ca").when(appConfig).getDbUserPwd();
        //Class.forName("org.postgresql.Driver");
        Connection connection = DriverManager.getConnection("jdbc:postgresql://" + appConfig.getHostAddress() + ":" + appConfig.getHostPort() + "/"
                + appConfig.getDbName(), appConfig.getDbUserName(), appConfig.getDbUserPwd());
    }

    public static void main(String[] args) {
        Result result = JUnitCore.runClasses(ConnectTest.class);
        for (Failure failure : result.getFailures()) {
            System.out.println(failure.getMessage());
        }
        System.out.println("The test was successfull: " + result.wasSuccessful());
    }
}
