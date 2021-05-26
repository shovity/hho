#!/usr/bin/env node

const fs = require('fs')
const pdf = require('pdf-parse')

const package = require('./package.json')


const main = async () => {

    const files = fs.readdirSync('.').filter(p => p.endsWith('.pdf'))
    const cvs = []

    for (const file of files) {
        const buffer = fs.readFileSync(file)
        const data = await pdf(buffer)
        const raw = data.text

        const cv = {
            file: file.replace(/\s+/g, ' ').trim().slice(0, -4),
        }

        const kick = (name, regex) => {
            const rr = raw.match(regex)
            cv[name] = rr && rr[0] || ''
        }

        kick('email', /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)
        kick('phone', /[0-9]{10,12}/)
        kick('birth', /[0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4}/)
        kick('github', /github\.com\/[0-9a-zA-z\-\.]+/)
        kick('name', /(nguyễn|trần|lê|phạm|hoàng|huỳnh|phan|vũ|võ|đặng|bùi|đỗ|hồ|ngô|dương|lý|bá|bảo|bồ|cao|cấn|chu|danh|doãn|điều|đan|đàm|đào|đinh|đoàn|đổng|đới|đường|giao|giáp|hà|hán|hoa|hồng|hùng|hứa|hướng|kông|kiểu|kha|khà|khương|khâu|khiếu|khoa|khổng|khu|khuất|khúc|khưu|kiều|kim|khai|lãnh|lạc|lại|lăng|lâm|lèng|lều|liên|liêu|liễu|linh|lò|lô|lỗ|lộ|luyện|lục|lư|lương|lường|lưu|lý|mùa|ma|mai|mang|mã|mạc|mạch|mạnh|mâu|mầu|mẫn|mộc|mục|ngạc|nhan|ninh|nhâm|ngân|nghiêm|nghị|ngọ|ngọc|ngũ|ngụy|nhữ|nông|ong|ông|phi|phí|phó|phong|phù|phú|phùng|phương|quản|quán|quang|quàng|quảng|quách|sái|sầm|sơn|sử|sùng|tán|tào|tạ|tăng|tấn|tề|thang|thái|thành|thào|thạch|thân|thẩm|thập|thế|thi|thiều|thịnh|thoa|thôi|thục|tiêu|tiếp|tinh|tòng|tô|tôn|tông|tống|trang|trác|trà|tri|triệu|trình|trịnh|trương|từ|uzông|vạn|vi|viêm|vương|xa|yên) [a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵýỷỹ]+ [a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵýỷỹ]+ ?[a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵýỷỹ]+?/i)

        cvs.push(cv)
    }

    const content = 'file,email,phone,birth,github,name\n' + 
        cvs.map(c => `${c.file},${c.email},${c.phone},${c.birth},${c.github},${c.name}\n`).join('/n')

    fs.writeFileSync('hho_result.csv', content)
    console.log(`verison=${package.version}, out=hho_result.csv`)

    // console.log(cvs[0])
}

main().catch(console.error)