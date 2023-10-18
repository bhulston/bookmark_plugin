export function write_doc (title, time, url, note, read) {
    yaml = `
    ---
    {
        "title": "${title}",
        "time": "${time}",
        "url": "${url}",
        "note": "${note}",
        "read": read
    }
    ---
    `
    markdown = `
    # {{title}}
    {{note}}
    `

    markdown += yaml; // Instead, probably make the yaml file as the new note. Then append to it using the markdown 
    console.log(markdown);
    return markdown;
};

