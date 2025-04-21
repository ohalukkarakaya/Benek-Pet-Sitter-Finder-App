import User from "../../models/User.js";

import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";

const getAllEmployeesController = async ( req, res ) => {
    try{
        
        const lastItemId = req.params.lastItemId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        const employeeFilter = { "authRole": { $ne: 0 } }
        if( lastItemId !== 'null' ){
            const lastItem = await User.findById(lastItemId);
            if(lastItem){
                employeeFilter.createdAt = { $gt: lastItem.createdAt };
            }
        }
        const totalEmployeecount = await User.countDocuments( employeeFilter );

        let employeeRawData = await User.find( employeeFilter ).sort({ createdAt: 1 }).limit( limit ).lean();
        let employeeList = [];

        for( let employee of employeeRawData ){
            const employeeInfo = getLightWeightUserInfoHelper( employee );
            employeeInfo.authRole = employee.authRole;
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