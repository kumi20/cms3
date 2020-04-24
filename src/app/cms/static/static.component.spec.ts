import { TestBed, async, inject } from '@angular/core/testing';

import { STATIC } from './mock-static-data';
import { AppService } from './../../app.service';

describe('PersonService', () => {

beforeEach(async(() => {
TestBed.configureTestingModule({
providers: [
  AppService
]
});
}));

it(`should have persons property`, async(() => {
inject([AppService], service => {
service.persons = STATIC;

expect(service.persons.length).toBe(2);
});
}));

it('should return proper Person object', async(() => {
inject([AppService], service => {
service.persons = STATIC;

expect(service.getStaticList(124).static_id).toBe('113');
});
}));

it('should save and load persons', async(() => {
inject([AppService], service => {
service.persons = STATIC;

service.loadPersons();
expect(service.getPerson(123).static_id).toBe('113');
});
}));

it('should edit person', async(() => {
inject([AppService], service => {
service.persons = STATIC;

service.editPerson(124,
{
id: 124
,firstName : 'Maria'
,lastName : 'Kowalska'
});
service.loadPersons();
expect(service.getPerson(124).static_id).toBe('113');
});
}));

it('should remove person', async(() => {
inject([AppService], service => {
service.persons = STATIC;

service.removePerson(123);
expect(service.persons.length).toBe(1);
});
}));

it('should add person', async(() => {
inject([AppService], service => {
service.persons = STATIC;

service.addPerson({
id: 125
,firstName : 'Jola'
,lastName : 'Nowak'
});
expect(service.persons.length).toBe(3);
});
}));

});