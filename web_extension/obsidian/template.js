export function write_doc (title, time, url, note, read, option) {
    // CHANGE this to retrieve the yaml and markdown from the options page
    if (option == 'yaml') { //for when we want write doc to create a new document for it
            let yaml = 
`---
{
    "title": "${title}",
    "time": "${time}",
    "url": "${url}",
    "note": "${note}",
    "read": ${read},
    #bookmark
}
---`
            const markdown = 
`
# ${title}
${note}
`

        yaml += markdown; // Instead, probably make the yaml file as the new note. Then append to it using the markdown 
        console.log(yaml);
    
    return yaml;
    } else { //for when we want to append it to an existing document (adding it as a card kind of)
        const markdown = 
`
## ${title}
${url}, 
${note},
${time}
---`
        return markdown;
    };
    
};

