-- CreateTable
CREATE TABLE "Snapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "motorTemperature" REAL NOT NULL,
    "batteryTemperature" REAL NOT NULL,
    "batteryPercentage" REAL NOT NULL,
    "tyrePressure" REAL NOT NULL,
    "speed" REAL NOT NULL,
    "chargeRate" REAL NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
