export function write_doc (templateString, variables) {
    // Use a regex to replace all instances of ${variable} with its value from the variables object
    console.log('Template String is:', templateString, typeof(templateString));
  return templateString.replace(/\$\{(\w+)\}/g, (match, name) => {
    // If the variable isn't defined, return an empty string
    return typeof variables[name] !== 'undefined' ? variables[name] : '';
  });
};