import { fileURLToPath } from 'url';
import fs from 'fs';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class AdvancedLocalSession {
    constructor (options = {}) {
        this.storagePath = options.storagePath || path.resolve(./'session.json');
        this.global = options.global || {};

        if (!fs.existsSync(this.storagePath)) {
            fs.writeFileSync(this.storagePath, JSON.stringify({
                users: {},
                globals: this.global
            }, null, 2));
        }

        this.data = JSON.parse(fs.readFileSync(this.storagePath, 'utf-8'));
    }

    middleware () {
        return async (ctx, next) => {
            const { id } = ctx.from;

            if (!this.data.users[id]) {
                this.data.users[id] = {};
                this.save();
            }

            ctx.session = new Proxy(this.data.users[id], {
                set: (t, k, v) => {
                    t[k] = v;
                    this.save();
                    return true;
                },
                get: (t, k) => t[k],
                deleteProperty: (t, k) => {
                    delete t[k];
                    this.save();
                    return true;
                }
            });

            ctx.getGlobal = key => this.getGlobal(key);
            ctx.setGlobal = (key, value) => this.setGlobal(key, value);

            await next();
        }
    }

    getAllUsers () {
        return Object.keys(this.data.users);
    }

    getUserById (userId) {
        return this.data.users[userId] || null;
    }

    getGlobal (key) {
        return this.data.globals[key];
    }

    setGlobal (key, value) {
        this.data.globals[key] = value;
        this.save();
    }

    save () {
        fs.writeFileSync(this.storagePath, JSON.stringify(this.data, null, 2));
    }
}
