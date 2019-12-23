(function() {
/** Implementation of the simple ticketing system  */

  /** Simple extend function to extend simple object */
  function extend(target, extensions) {
    for (let ext in extensions) {
      target[ext] = extensions[ext];
    }
  }

  function DMV(maxTicketsToProcess = 5) {
    this.ticketsFree = new Array(40).fill(null).map((_, index) => index + 1);
    this.ticketsProcessing = [];
    this.maxTicketsToProcess = maxTicketsToProcess;
    this.waitingList = new WaitingList();
  }
  
  function WaitingListPerson(ticketNum) {
    this.ticketNum = ticketNum;
    this.notifyTicket = function(num, accept) {
      if (this.ticketNum === num) {
        accept();
      }
    }
  }

  // Extracts ticket # from this.ticketsFree
  // Adds extracted ticket # to this.ticketsProcessing
  // Or add to this.waitingList
  DMV.prototype.add = function(person) {
    if (this.ticketsProcessing.length < this.maxTicketsToProcess) {
      const ticketNum = this.ticketsFree.shift();
      console.log(`Taking next ticket #${ticketNum} for ${person.name}`);
      this.processNext(person, ticketNum)
    } else {
      this.addToWaitingList(person)
    }
  }
  
  // Appends "processing" and "ticketNum" to person
  // Inserts ticket # to this.ticketsProcessing if holding ticketNum
  DMV.prototype.processNext = function(person, ticketNum) {
    person.processing = true;
    if (ticketNum !== undefined) {
      person.ticketNum = ticketNum;
      this.ticketsProcessing.push(ticketNum);
    }
    console.log(`Person processed: ${person.name}!!!`);
  }
  
  // Extracts ticket # from this.ticketsFree
  // Adds extracted ticket # to this.waitingList
  DMV.prototype.addToWaitingList = function(person) {
    const ticketNum = this.ticketsFree.splice(0, 1)[0];
    extend(person, new WaitingListPerson(ticketNum));
    this.waitingList.add(person);
  }
  
  // Extracts ticket # from this.ticketsProcessing
  // Adds extracted ticket to this.ticketsFree
  DMV.prototype.complete = function(person) {
    const index = this.ticketsProcessing.indexOf(person.ticketNum);
    console.log(`Got index of ${index}`);
    this.ticketsProcessing.splice(index, 1)[0];
    this.ticketsFree.push(person.ticketNum);
    delete person.ticketNum;
    delete person.processing;
    console.log(`Ticket processing complete with ${person.name}.`);
    if (this.waitingList.count() > 0) {
      this.waitingList.broadcastNext(this.ticketsFree.shift());
    }
  }

  function WaitingList() {
    this.waitingList = [];
  }
  
  WaitingList.prototype.add = function(person) {
    this.waitingList.push(person);
  }
  
  WaitingList.prototype.removeAt = function(index) {
    this.waitingList.splice(index, 1);
  }
  
  WaitingList.prototype.get = function(index) {
    return this.waitingList[index];
  }
  
  WaitingList.prototype.count = function() {
    return this.waitingList.length;
  }
  
  WaitingList.prototype.indexOf = function(ticketNum, startIndex) {
    let currentIndex = startIndex;
    while (currentIndex < this.waitingList.length) {
      const person = this.waitingList[currentIndex];
      if (person.ticketNum === ticketNum) {
        return currentIndex;
      }
      currentIndex++;
    }
    return -1;
  }
  
  WaitingList.prototype.broadcastNext = function(ticketNum) {
    console.log(`Start processing new ticket num - ${ticketNum}.`);
    const self = this;
    this.waitingList.forEach(function(person) {
      person.notifyTicket(ticketNum, function accept() {
        const index = self.waitingList.indexOf(person);
        console.log(`Found index: ${index}`);
        self.waitingList.removeAt(index);
        delete person.processing;
        delete person.ticketNum;
        self.ticketsProcessing.push(ticketNum);
      });
    });
  }

  function Person(name) {
    this.name = name;
  }

  

  const alhambraDmv = new DMV();

  const michael = new Person('michael');
  const ellis = new Person('ellis');
  const joe = new Person('joe');
  const jenny = new Person('jenny');
  const clarissa = new Person('clarissa');
  const bob = new Person('bob');
  const lisa = new Person('lisa');
  const crystal = new Person('crystal');

  alhambraDmv.add(michael);
  alhambraDmv.add(ellis);
  alhambraDmv.add(joe);
  alhambraDmv.add(jenny);
  alhambraDmv.add(clarissa);
  alhambraDmv.add(bob);
  alhambraDmv.add(lisa);
  alhambraDmv.add(crystal);

  const ticketsFree = alhambraDmv.ticketsFree;
  const ticketsProcessing = alhambraDmv.ticketsProcessing;

  console.log(`waiting list: ${alhambraDmv.waitingList}`);
  console.log(`waiting count: ${alhambraDmv.waitingList.count()}`);
  console.log(
    `ticketsFree: ${ticketsFree.length ? ticketsFree.map((s) => s) : 0}`,
  );
  console.log(`ticketsProcessing: ${ticketsProcessing.map((s) => s)}`);
  console.log(michael);
  console.log(ellis);
  console.log(joe);
  console.log(jenny);
  console.log(clarissa);
  console.log(bob);
  console.log(lisa);
  console.log(crystal);

  console.log(`Make joe complete`);
  alhambraDmv.complete(joe);

  console.log(`Finished to make joe complete`);

  console.log(`waitingNum: ${alhambraDmv.waitingList.count()}`);
  console.log(
    `ticketsFree: ${ticketsFree.length ? ticketsFree.map((s) => s) : 0}`,
  );
  console.log(`ticketsProcessing: ${ticketsProcessing.map((s) => s)}`);

  alhambraDmv.complete(clarissa);

  console.log(michael);
  console.log(ellis);
  console.log(joe);
  console.log(jenny);
  console.log(clarissa);
  console.log(bob);
  console.log(lisa);  
  console.log(crystal);

  console.log(`Finished all!!!!`)
})();