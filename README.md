Blockchain based Air Traffic Management for Unmanned Aerial Systems (UTM)

A NodeJS application running on a lite-server, was developed to demonstrate the proposal and test viability. At a very high level, the proof of concept developed consists of two main modules: the UAS routing module and a decentralised app (dApp) module to integrate with a local blockchain for data management and smart contract functionality. The routing module includes functionality to load dummy data to simulate real world airspace and drone traffic data to test the path finding functionality. It also consisted of the graphical user-interface for UAS operator and path visualisation aspects. The front-end graphical user interface (GUI) of the proof of concept is designed from the perspective of a UAS operator who wishes to file a flight path for a drone, is able to visualise the potential flight path and confirm the plan along with time of launch. The dApp module builds the airspace traffic map for the duration of the planned flight path, calculates the shortest route and files the approved flight path on to the local blockchain. This is done in accordance with the smart contract code on a blockchain so that this can be propagated to all other stakeholders within the UTM system.
