import User from "../../models/User.js";

import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";

const getAllEmployeesController = async ( req, res ) => {
    try{
        
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const employeeFilter = { "authRole": { $ne: 0 } }
        const totalEmployeecount = await User.countDocuments( employeeFilter );

        let employeeRawData = await User.find( employeeFilter ).skip( skip ).limit( limit ).lean();
        let employeeList = [];

        for( let employee of employeeRawData ){
            const employeeInfo = getLightWeightUserInfoHelper( employee );
            employeeList.push( employeeInfo );
        }

        return res.status( 200 ).json({
            error: false,
            message: "Operation Succesful",
            totalEmployeecount: totalEmployeecount,
            employeeData: employeeList
        });

    }catch( err ){
        console.log( "ERROR: getAllEmployeesController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getAllEmployeesController;