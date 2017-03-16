/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.rdcit.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import static org.junit.Assert.assertTrue;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

/**
 *
 * @author sa841
 *
 * AppConfigTestImplementation_Test test if the AppConfig' methods
 */
public class AppConfigTest_IT {

    private String[] mockSetParams(File f) throws Exception {
        String[] result = new String[2];
        BufferedReader br;
        String lItemName = "";
        String dbCredentials = "";

        String sCurrentLine;
        br = new BufferedReader(new FileReader(f));
        while ((sCurrentLine = br.readLine()) != null) {
            if (sCurrentLine.startsWith("itemName")) {
                lItemName = sCurrentLine;
            } else if (sCurrentLine.startsWith("OC_DB")) {
                dbCredentials = sCurrentLine;
            }
        }
        br.close();
        result[0] = lItemName;
        result[1] = dbCredentials;
        return result;
    }

    @Test  public void setParamsTest_Wright_Path() throws Exception {
        String confFilePath = AppConfig.class.getProtectionDomain().getCodeSource().getLocation().getPath() + "OcRestWS.conf";
        File confFile = new File(confFilePath);
        String[] result = mockSetParams(confFile);
        assertTrue(result[0].split("=").length == 2);
        assertTrue(result[1].split("\t").length == 6);
    }

    @Test(expected = java.io.FileNotFoundException.class) public void setParamsTest_Wrong_Path() throws Exception {
        String confFilePath = "c:\\user\\Documents\\OcRestWS.conf";
        File confFile = new File(confFilePath);
        mockSetParams(confFile);
    }

    @Test(expected = java.lang.ArrayIndexOutOfBoundsException.class) public void setParamsTest_Wrong_Formatted_file() throws Exception {
        String confFilePath = AppConfig.class.getProtectionDomain().getCodeSource().getLocation().getPath() + "OcRestWS_Test.conf";
        File confFile = new File(confFilePath);
        String[] result = mockSetParams(confFile);
        String itemName = (result[0].split("="))[1];
        String dnUserPwd = (result[0].split("\t"))[5];
    }

    public static void main(String[] args) {
        Result result = JUnitCore.runClasses(AppConfigTest_IT.class);
        for (Failure failure : result.getFailures()) {
            System.out.println(failure.getMessage());
        }
        System.out.println("The test was successfull: " + result.wasSuccessful());
    }
}
