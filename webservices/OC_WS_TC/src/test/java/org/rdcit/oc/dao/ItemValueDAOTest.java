/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.rdcit.oc.dao;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

import org.rdcit.controller.AppConfig;

/**
 *
 *
 * @author sa841
 */

public class ItemValueDAOTest {

    static Connection spyConnection;
    AppConfig spyAppConfig;
    String studyName = "Tool Test Study";
    String crfName = "PhenoIntegrator";
    String crfVersion = "v1.0";
    String subjectID = "bob001";

    @BeforeClass
    public static void initConnection() {
        Connect connect = new Connect();
        Connection connection = connect.openConnection();
        spyConnection = spy(connection);
    }

    @Before
    public void initConfigFile() {
        spyAppConfig = mock(AppConfig.class);
    }

    public String mockGetItemValueMethod(Connection connection, String studyName, String crfName, String crfVersion, String subjectID, String itemName) throws SQLException {
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
        if(rs.next()) return rs.getString("value");
        else return "";
    }

    @Test
    public void testGetItemName_Case_IDEAL() throws SQLException {
        doReturn("Phenotips patient link").when(spyAppConfig).getItemName();
        String response = mockGetItemValueMethod(spyConnection, studyName, crfName, crfVersion, subjectID, spyAppConfig.getItemName());
        String expectedResponse = "unique_link_to_lookup";
        assertTrue(expectedResponse.equals(response));
    }

    @Test
    public void testGetItemName_Case_ItemName_Not_Well_Defined() throws SQLException {
        doReturn("").when(spyAppConfig).getItemName();
        String response = mockGetItemValueMethod(spyConnection, studyName, crfName, crfVersion, subjectID, spyAppConfig.getItemName());
        assertTrue(response.isEmpty());
    }

    @Test(expected = java.io.FileNotFoundException.class)
    public void testGetItemName_Case_Config_File_NOT_FOUND() throws SQLException {
        doThrow(java.io.FileNotFoundException.class).when(spyAppConfig).getItemName();
        mockGetItemValueMethod(spyConnection, studyName, crfName, crfVersion, subjectID, spyAppConfig.getItemName());
    }

    @Test(expected = SQLException.class)
    public void testGetItemName_Case_Connection_DB_Fail() throws SQLException {
        Connect mockConnection = mock(Connect.class);
        doThrow(SQLException.class).when(mockConnection).openConnection();
        mockGetItemValueMethod(mockConnection.openConnection(), studyName, crfName, crfVersion, subjectID, spyAppConfig.getItemName());
    }

    public static void main(String[] args) {
        Result result = JUnitCore.runClasses(ItemValueDAOTest.class);
        for (Failure failure : result.getFailures()) {
            System.out.println(failure.getMessage());
        }
        System.out.println("The test was successful: " + result.wasSuccessful());
    }

}
