/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.rdcit.oc.ws;

import java.sql.SQLException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.json.JSONObject;
import org.rdcit.oc.dao.ItemValueDAO;

/**
 *
 * @author sa841
 */
@Path("itemValue/{studyName}/{crfName}/{crfVersion}/{subjectID}")
public class ItemValue {

    /**
     * Method handling HTTP GET requests. The returned object will be sent to
     * the client as "JSON" media type.
     *
     * @param studyName
     * @param crfName
     * @param crfVersion
     * @param subjectID
     * @return String that will be returned as a JSON response.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getValue(@PathParam("studyName") String studyName, @PathParam("crfName") String crfName, @PathParam("crfVersion") String crfVersion, @PathParam("subjectID") String subjectID) {
        try {
            ItemValueDAO itemValueDao = new ItemValueDAO(studyName, crfName, crfVersion, subjectID);
            return itemValueDao.getStudySubjectItemValue();
        } catch(Exception ex) {
            JSONObject joResponse = new JSONObject();
            joResponse.put("Service", "RDCIT");
            joResponse.put("Response", "");
            if (SQLException.class.isInstance(ex)) {
                 joResponse.put("ErrCode", "4");
                joResponse.put("Message", "Connection to the db has failed!");
            } else {
                joResponse.put("ErrCode", "5");
                joResponse.put("Message", "The configuration file was not found!");
            }
            return joResponse.toString();
        }

    }

}
