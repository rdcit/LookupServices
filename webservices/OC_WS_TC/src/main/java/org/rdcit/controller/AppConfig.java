/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.rdcit.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 *
 * @author sa841
 */
public class AppConfig {

    //private final String confFilePath = AppConfig.class.getProtectionDomain().getCodeSource().getLocation().getPath().replace("AppConfig.class", "OcRestWS.conf");
    //private final String confFilePath = "OcRestWS.conf";
    private final String confFilePath = AppConfig.class.getProtectionDomain().getCodeSource().getLocation().getPath() + "OcRestWS.conf";
    private File confFile = new File(confFilePath);
    private String itemName;
    private String hostAddress;
    private String hostPort;
    private String dbName;
    private String dbUserName;
    private String dbUserPwd;

    private static AppConfig appConfig = null;

    private AppConfig() {
    }

    public static AppConfig getAppConfig() {
        if (appConfig == null) {
            appConfig = new AppConfig();
            appConfig.setParameters();
        }
        return appConfig;
    }

    public String getConfFilePath() {
        return confFilePath;
    }

    public void setParameters() {
        BufferedReader br;
        String lItemName = "";
        String dbCredentials = "";
        try {
            String sCurrentLine;
            br = new BufferedReader(new FileReader(confFile));
            while ((sCurrentLine = br.readLine()) != null) {
                if (sCurrentLine.startsWith("itemName")) {
                    lItemName = sCurrentLine;
                } else if (sCurrentLine.startsWith("OC_DB")) {
                    dbCredentials = sCurrentLine;
                }
            }
            br.close();
            String[] arIteName = lItemName.split("=");
            String[] arrDbCredentials = dbCredentials.split("\t");
            itemName = arIteName[1];
            hostAddress = arrDbCredentials[1];
            hostPort = arrDbCredentials[2];
            dbName = arrDbCredentials[3];
            dbUserName = arrDbCredentials[4];
            dbUserPwd = arrDbCredentials[5];
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    public String getItemName() {
        return itemName;
    }

    public String getHostAddress() {
        return hostAddress;
    }

    public String getHostPort() {
        return hostPort;
    }

    public String getDbName() {
        return dbName;
    }

    public String getDbUserName() {
        return dbUserName;
    }

    public String getDbUserPwd() {
        return dbUserPwd;
    }

}
