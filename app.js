#!/usr/bin/env node

const fs = require('fs')
const pdf = require('pdf-parse')
const WordExtractor = require("word-extractor")

const package = require('./package.json')

const wordExtractor = new WordExtractor()

const main = async () => {
    const files = fs.readdirSync('.').filter(p => /\.pdf|\.doc|\.docx$/.test(p))
    const cvs = []

    for (const file of files) {
        const ext = file.split('.').pop()
        const buffer = fs.readFileSync(file)
        
        const cv = {
            raw: '',
            file: file,
            name: file.split('.')[0].split(' - ')[1],
            position: file.split(' - ')[0],
        }

        if (ext === 'pdf') {
            const data = await pdf(buffer)
            cv.raw = data.text
        } else if (ext === 'doc' || ext === 'docx') {
            const doc = await wordExtractor.extract(buffer)
            cv.raw = await doc.getBody()
        }
        
        const kick = (name, regex) => {
            const rr = cv.raw.match(regex)
            cv[name] = rr && rr[0] || ''
        }

        kick('email', /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)
        kick('phone', /(\+84)?[ 0-9]{7,10}[0-9]{2}/)
        kick('birth', /[0-9]{1,2} ?\- ?[0-9]{1,2} ?\- ?[0-9]{4}|[0-9]{1,2} ?\/ ?[0-9]{1,2} ?\/ ?[0-9]{4}|[0-9]{1,2} ?\. ?[0-9]{1,2} ?\. ?[0-9]{4}|[0-9]{1,2} ?\– ?[0-9]{1,2} ?\– ?[0-9]{4}/)
        kick('github', /github\.com\/[0-9a-zA-z\-\.]+/)
        kick('facebook', /facebook\.com\/[0-9a-zA-z\-\.]+/)

        cv.birth = cv.birth.replace(/ /g, '').replace(/\-|\.|\–/g, '/')
        cv.phone = cv.phone.replace(/[^0-9+]/g, '').replace('+84', '0')

        cvs.push(cv)
    }

    const content = 'file,name,email,phone,position,birth,github,facebook\n' + 
        cvs.map(c => `${c.file},${c.name},${c.email},${c.phone},${c.position},${c.birth},${c.github},${c.facebook}`).join('\n')

    fs.writeFileSync('hho_result.csv', content)
    console.log(`verison=${package.version}, out=hho_result.csv`)

    // console.log(cvs[0])
}

main().catch(console.error)