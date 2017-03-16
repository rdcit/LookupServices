/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.rdcit.controller;

import static org.junit.Assert.assertFalse;
import org.junit.Test;
import static org.junit.Assert.assertTrue;
import org.junit.BeforeClass;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

/**
 *
 * @author sa841
 *
 *  AppConfigTest_Behaviour_Test make sure that the answer is correct under the
 *  given circumstances.
 * 
 */

public class AppConfigTest_BT {

    static AppConfig appConfig;

    @BeforeClass public static void init() {
        appConfig = AppConfig.getAppConfig();
    }

    @Test public void getConfigFilePathTest_CallRealMethod() {
        assertTrue(appConfig.getConfFilePath().endsWith("OcRestWS.conf"));
    }

    @Test public void getItemNameTest_CallRealMethod() {
        assertFalse(appConfig.getItemName().isEmpty());
    }

    @Test public void getDbCrendentialsTest_CallRealMethod() {
        assertFalse(appConfig.getHostAddress().isEmpty());
        assertFalse(appConfig.getHostPort().isEmpty());
        assertFalse(appConfig.getDbName().isEmpty());
        assertFalse(appConfig.getDbUserName().isEmpty());
        assertFalse(appConfig.getDbUserPwd().isEmpty());
    }


    public static void main(String[] args) {
        Result result = JUnitCore.runClasses(AppConfigTest_BT.class);
        for (Failure failure : result.getFailures()) {
            System.out.println(failure.getMessage());
        }
        System.out.println("The test was successful: " + result.wasSuccessful());
    }
}
