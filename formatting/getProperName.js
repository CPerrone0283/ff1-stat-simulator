export function getProperName(uglyLabel) {

    const properName = uglyLabel.replace(/([A-Z])/g, ' $1');
    const fullProperName = properName[0].toUpperCase() + properName.slice(1);
    return fullProperName;

}