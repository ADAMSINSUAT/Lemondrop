import _ from "lodash";
import {v4 as uuidv4} from 'uuid';
import { deleteDB, selectDB } from "../lib/database/query";
import parkingLot from "../modules/parkinglot";

test("parking lot properties", ()=>{
    const models = new parkingLot({parkingLotNumber: 0, parkingLotPosition: "L", parkingLotSize: "SP", parkingLotDistance: 100});

    expect(models.data.parkingLotNumber).toBe(0);
    expect(models.data.parkingLotPosition).toBe("L");
    expect(models.data.parkingLotSize).toBe("SP");
    expect(models.data.parkingLotDistance).toBe(100);
})

test("parking lot insert", ()=>{
    const totalParkingLots: number = 30;
    let parkingLotNumber: number = 0;
    const parkingPotentalPosition = ["L", "M", "R"];
    let parkingLotPosition: string = "";
    const parkingPotentialSize = ["SP", "MP", "LP"];
    let parkingLotSize;
    let parkingLotDistance: number = 0;

    const parkinglotArr = [];

    for (let i = 0; i <= 30; i++) {
        parkingLotNumber = i;

        if (parkingLotNumber <= 10) {
            parkingLotPosition = parkingPotentalPosition[0];
        } else if (parkingLotNumber <= 20) {
            parkingLotPosition = parkingPotentalPosition[1];
        } else if (parkingLotNumber <= 30) {
            parkingLotPosition = parkingPotentalPosition[2];
        }

        if (i > 10) {
            parkingLotNumber = i - 10;
        }
        if (i > 20) {
            parkingLotNumber = i - 20;
        }

        parkingLotDistance = parkingLotNumber + 5 - parkingLotNumber * 2;

        if (parkingLotDistance < 0) {
            parkingLotDistance = parkingLotDistance * -1;
        }

        parkingLotSize = parkingPotentialSize[Math.floor(Math.random() * parkingPotentialSize.length)];


        let parkingModel = new parkingLot({ parkingLotNumber: i, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: parkingLotDistance })

        parkinglotArr.push(parkingModel);
        // new parkingLot({ parkingLotNumber: 1, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 2, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 3, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 4, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 5, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 6, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 7, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 8, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 9, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 10, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 11, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 12, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 13, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 14, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 15, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 16, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 17, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 18, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 19, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 20, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 21, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 22, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 23, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 24, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 25, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 26, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 27, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 28, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 29, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0 }),
        //     new parkingLot({ parkingLotNumber: 30, parkingLotPosition: parkingLotPosition, parkingLotSize: parkingLotSize, parkingLotDistance: 0}),
    }


    _.forEach(parkinglotArr, function(parking){
        const insertModel = new parkingLot({parkingLotNumber: parking.data.parkingLotNumber, parkingLotPosition: parking.data.parkingLotPosition, parkingLotSize: parking.data.parkingLotSize, parkingLotDistance: parking.data.parkingLotDistance});
        insertModel.insert();
    })
})

// test("delete parking lot", async()=>{
//     //await deleteDB("ParkingLot")
// })