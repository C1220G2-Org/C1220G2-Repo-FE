import {AbstractControl, ValidationErrors} from '@angular/forms';

export class Validation {

  public static checkdate(control: AbstractControl): ValidationErrors | null {
    let value = Date.parse(control.value);
    const DateDifMs = Date.now() - (24 * 60 * 60 * 1000);
    if (value > DateDifMs) {
      return null;
    } else {
      return {invalidDateNow: true};
    }
  }


  public static compareDate(elementControl: AbstractControl) {
    const elementHours = elementControl.value;
    let startDate = Date.parse(elementHours.startDate);
    let endDate = Date.parse(elementHours.endDate);
    return (startDate <= endDate) ? null : {noMartDate: true};
  }

  public static compareHour(elementControl: AbstractControl) {
    const elementHours = elementControl.value;
    console.log('test compare' + elementHours);
    console.log(Date.parse(('2021-01-01 ' + elementHours.startHour + ':00')) + 'va' + (Date.parse('2021-01-01 ' + elementHours.endHour + ':00')));
    return Date.parse(('2021-01-01 ' + elementHours.startHour + ':00')) < (Date.parse('2021-01-01 ' + elementHours.endHour + ':00')) ? null : {notmatchHour: true};
  }

  public static compareDate30(elementControl: AbstractControl) {
    const elementHours = elementControl.value;
    let startDate = Date.parse(elementHours.startDate);
    let endDate = Date.parse(elementHours.endDate);

    console.log('(endDate-startDate)/(24*60*60*1000)');
    console.log((endDate - startDate) / (24 * 60 * 60 * 1000));
    //
    return ((endDate - startDate) / (24 * 60 * 60 * 1000) <= 31) ? null : {compareDate30: true};
  }
}
