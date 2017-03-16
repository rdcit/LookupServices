/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.rdcit.oc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.json.JSONObject;
import org.rdcit.controller.AppConfig;

/**
 *
 * @author sa841
 */
public class ItemValueDAO {

    String studyName;
    String subjectID;
    String itemName;
    String crfName;
    String crfVersion;
    Connect connect;
    Connection connection;
    AppConfig appConfig;
    JSONObject joResponse;

    public ItemValueDAO(String studyName, String crfName, String crfVersion, String subjectID) {
        this.studyName = studyName;
        this.subjectID = subjectID;
        this.crfName = crfName;
        this.crfVersion = crfVersion;
        appConfig = AppConfig.getAppConfig();
        itemName = appConfig.getItemName();
        connect = new Connect();
        connection = connect.openConnection();
        joResponse = new JSONObject();
        joResponse.put("Service", "RDCIT");
    }

    public String getStudySubjectItemValue() {
        String value = "";
        try {
            PreparedStatement stmt = connection.prepareStatement("SELECT value FROM item_data "
                    + "INNER JOIN item_form_metadata ON item_data.item_id = item_form_metadata.item_id\n"
                    + "INNER JOIN event_crf ON event_crf.event_crf_id = item_data.event_crf_id AND event_crf.crf_version_id = item_form_metadata.crf_version_id\n"
                    + "INNER JOIN study_event ON study_event.study_event_id = event_crf.study_event_id\n"
                    + "INNER JOIN study_event_definition ON study_event_definition.study_event_definition_id = study_event.study_event_definition_id\n"
                    + "INNER JOIN study ON study.study_id = study_event_definition.study_id\n"
                    + "INNER JOIN study_subject ON study_subject.study_subject_id = event_crf.study_subject_id\n"
                    + "INNER JOIN crf_version ON crf_version.crf_version_id = event_crf.crf_version_id\n"
                    + "INNER JOIN crf ON crf.crf_id = crf_version.crf_id\n"
                    + "WHERE study.name = ?"
                    + "AND study_subject.label = ? "
                    + "AND item_form_metadata.left_item_text = ? "
                    + "AND crf.name = ? "
                    + "AND crf_version.name = ?;",
                    ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
            stmt.setString(1, studyName);
            stmt.setString(2, subjectID);
            stmt.setString(3, itemName);
            stmt.setString(4, crfName);
            stmt.setString(5, crfVersion);
            ResultSet rs = stmt.executeQuery();
            rs.last();
            int countRS = rs.getRow();
            switch (countRS) {
                case 0:
                    if (checkItemName()) {
                        joResponse.put("ErrCode", "1");
                        joResponse.put("Response", "");
                        joResponse.put("Message", "The value is empty");
                    } else {
                        joResponse.put("ErrCode", "3");
                        joResponse.put("Response", "");
                        joResponse.put("Message", "The item name does not exist.");
                    }
                    break;
                case 1:
                    joResponse.put("ErrCode", "0");
                    joResponse.put("Response", rs.getString("value"));
                    joResponse.put("Message", "OK");
                    break;
                default:
                    joResponse.put("ErrCode", "2");
                    joResponse.put("Response", "");
                    joResponse.put("Message", "Multiple values was found.");
                    break;
            }
            value = joResponse.toString();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }
        connect.closeConnection();
        return value;
    }

    public boolean checkItemName() {
        boolean exist = false;
        try {
            PreparedStatement stmt = connection.prepareStatement("SELECT left_item_text FROM item_form_metadata "
                    + "INNER JOIN item_data ON item_data.item_id = item_form_metadata.item_id "
                    + "INNER JOIN study ON study.owner_id = item_data.owner_id "
                    + "INNER JOIN study_subject ON study_subject.study_id =  study.study_id"
                    + " WHERE study.name = ?"
                    + " AND study_subject.label = ?;");
            stmt.setString(1, studyName);
            stmt.setString(2, subjectID);
     
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                if (rs.getString("left_item_text").equals(itemName)) {
                    exist = true;
                    break;
                }
            }

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }
        return exist;
    }

    public static void main(String[] args) {
        ItemValueDAO itemValue = new ItemValueDAO("Tool Test Study", "PhenoIntegrator", "v1.0", "bob001");
        System.out.println(itemValue.getStudySubjectItemValue());
    }
}
